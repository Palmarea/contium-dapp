import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("DocumentRegistry", function () {
  let documentRegistry;
  let owner;
  let otherUser;

  // Hash de ejemplo (simula SHA-256 de un documento)
  const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
  const testHash2 = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd";
  const testMetadata = '{"name": "test.pdf", "size": 1024}';

  beforeEach(async function () {
    // Obtener signers
    const signers = await ethers.getSigners();
    owner = signers[0];
    otherUser = signers[1];

    // Deployar contrato fresco para cada test
    documentRegistry = await ethers.deployContract("DocumentRegistry");
  });

  // ============================================
  // TESTS DE REGISTRO
  // ============================================
  describe("Registro de Documentos", function () {
    
    it("✅ Debe registrar un documento nuevo", async function () {
      const tx = await documentRegistry.registerDocument(testHash, testMetadata);
      await tx.wait();

      const isRegistered = await documentRegistry.isRegistered(testHash);
      expect(isRegistered).to.be.true;
    });

    it("✅ Debe guardar la información correcta del documento", async function () {
      await documentRegistry.registerDocument(testHash, testMetadata);

      const doc = await documentRegistry.getDocument(testHash);
      expect(doc.owner).to.equal(owner.address);
      expect(doc.isValidated).to.be.false;
      expect(doc.metadata).to.equal(testMetadata);
    });

    it("❌ Debe fallar si el hash ya está registrado", async function () {
      await documentRegistry.registerDocument(testHash, testMetadata);

      await expect(
        documentRegistry.registerDocument(testHash, testMetadata)
      ).to.be.revertedWith("hash ya registrado");
    });

    it("❌ Debe fallar si el hash es inválido (bytes32(0))", async function () {
      const invalidHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

      await expect(
        documentRegistry.registerDocument(invalidHash, testMetadata)
      ).to.be.revertedWith("hash invalido");
    });

  });

  // ============================================
  // TESTS DE VALIDACIÓN
  // ============================================
  describe("Validación de Documentos", function () {

    beforeEach(async function () {
      await documentRegistry.registerDocument(testHash, testMetadata);
    });

    it("✅ Debe validar un documento registrado", async function () {
      const tx = await documentRegistry.validateDocument(testHash);
      await tx.wait();

      const doc = await documentRegistry.getDocument(testHash);
      expect(doc.isValidated).to.be.true;
    });

    it("✅ Debe sumar 10 puntos al validar", async function () {
      const scoreBefore = await documentRegistry.getScore(owner.address);
      expect(scoreBefore).to.equal(0n);

      await documentRegistry.validateDocument(testHash);

      const scoreAfter = await documentRegistry.getScore(owner.address);
      expect(scoreAfter).to.equal(10n);
    });

    it("❌ Debe fallar si el documento no existe", async function () {
      const nonExistentHash = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef";

      await expect(
        documentRegistry.validateDocument(nonExistentHash)
      ).to.be.revertedWith("no existe");
    });

    it("❌ Debe fallar si el documento ya está validado", async function () {
      await documentRegistry.validateDocument(testHash);

      await expect(
        documentRegistry.validateDocument(testHash)
      ).to.be.revertedWith("ya validado");
    });

    it("❌ Debe fallar si no eres el owner del documento", async function () {
      const contractAsOther = documentRegistry.connect(otherUser);
      
      await expect(
        contractAsOther.validateDocument(testHash)
      ).to.be.revertedWith("solo owner");
    });

  });

  // ============================================
  // TESTS DE SCORE Y LEADERBOARD
  // ============================================
  describe("Score y Leaderboard", function () {

    it("✅ Score inicia en 0", async function () {
      const score = await documentRegistry.getScore(owner.address);
      expect(score).to.equal(0n);
    });

    it("✅ Score aumenta 10 por cada validación", async function () {
      await documentRegistry.registerDocument(testHash, testMetadata);
      await documentRegistry.validateDocument(testHash);
      expect(await documentRegistry.getScore(owner.address)).to.equal(10n);

      await documentRegistry.registerDocument(testHash2, testMetadata);
      await documentRegistry.validateDocument(testHash2);
      expect(await documentRegistry.getScore(owner.address)).to.equal(20n);
    });

    it("✅ getTotalUsers retorna cantidad correcta", async function () {
      expect(await documentRegistry.getTotalUsers()).to.equal(0n);

      await documentRegistry.registerDocument(testHash, testMetadata);
      await documentRegistry.validateDocument(testHash);
      expect(await documentRegistry.getTotalUsers()).to.equal(1n);

      const contractAsOther = documentRegistry.connect(otherUser);
      await contractAsOther.registerDocument(testHash2, testMetadata);
      await contractAsOther.validateDocument(testHash2);
      expect(await documentRegistry.getTotalUsers()).to.equal(2n);
    });

    it("✅ getTopUsers retorna usuarios ordenados por score", async function () {
      // Owner: 20 puntos
      await documentRegistry.registerDocument(testHash, testMetadata);
      await documentRegistry.validateDocument(testHash);
      await documentRegistry.registerDocument(testHash2, testMetadata);
      await documentRegistry.validateDocument(testHash2);

      // OtherUser: 10 puntos
      const testHash3 = "0x3333333333333333333333333333333333333333333333333333333333333333";
      const contractAsOther = documentRegistry.connect(otherUser);
      await contractAsOther.registerDocument(testHash3, testMetadata);
      await contractAsOther.validateDocument(testHash3);

      const [topUsers, topScores] = await documentRegistry.getTopUsers(10);

      expect(topUsers[0]).to.equal(owner.address);
      expect(topScores[0]).to.equal(20n);
      expect(topUsers[1]).to.equal(otherUser.address);
      expect(topScores[1]).to.equal(10n);
    });

  });

});