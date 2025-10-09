const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  console.log("🎨 Cultural Heritage Protection - Interactive CLI\n");

  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log(`📡 Network: ${network.name} (Chain ID: ${network.chainId})`);

  // Load deployment information
  const deploymentFile = path.join(
    __dirname,
    "..",
    "deployments",
    `${network.name}-deployment.json`
  );

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      `❌ Deployment file not found. Please deploy first: npm run deploy`
    );
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📄 Contract: ${contractAddress}`);
  console.log(`🔗 Etherscan: ${deploymentInfo.etherscanUrl}\n`);

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log(`👤 Account: ${signer.address}`);

  const balance = await ethers.provider.getBalance(signer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} ETH\n`);

  // Connect to contract
  const CulturalHeritageProtection = await ethers.getContractFactory(
    "CulturalHeritageProtection"
  );
  const contract = CulturalHeritageProtection.attach(contractAddress);

  // Display menu
  await displayMenu(contract, signer);
}

async function displayMenu(contract, signer) {
  console.log("\n" + "=".repeat(60));
  console.log("                    MAIN MENU");
  console.log("=".repeat(60));
  console.log("1. View Contract Info");
  console.log("2. Register New Artifact");
  console.log("3. Grant Access to Artifact");
  console.log("4. Revoke Access from Artifact");
  console.log("5. Transfer Artifact Ownership");
  console.log("6. Certify Expert");
  console.log("7. View Artifact Information");
  console.log("8. View Access History");
  console.log("9. Deactivate Artifact");
  console.log("10. Reactivate Artifact");
  console.log("0. Exit");
  console.log("=".repeat(60) + "\n");

  const choice = await question("Select an option (0-10): ");

  switch (choice.trim()) {
    case "1":
      await viewContractInfo(contract);
      break;
    case "2":
      await registerArtifact(contract, signer);
      break;
    case "3":
      await grantAccess(contract, signer);
      break;
    case "4":
      await revokeAccess(contract, signer);
      break;
    case "5":
      await transferOwnership(contract, signer);
      break;
    case "6":
      await certifyExpert(contract, signer);
      break;
    case "7":
      await viewArtifactInfo(contract, signer);
      break;
    case "8":
      await viewAccessHistory(contract, signer);
      break;
    case "9":
      await deactivateArtifact(contract, signer);
      break;
    case "10":
      await reactivateArtifact(contract, signer);
      break;
    case "0":
      console.log("\n👋 Goodbye!");
      rl.close();
      return;
    default:
      console.log("\n❌ Invalid option. Please try again.");
  }

  await displayMenu(contract, signer);
}

async function viewContractInfo(contract) {
  console.log("\n📊 Contract Information:");
  console.log("-".repeat(60));

  const curator = await contract.curator();
  const totalArtifacts = await contract.totalArtifacts();

  console.log(`👨‍💼 Curator: ${curator}`);
  console.log(`🎨 Total Artifacts: ${totalArtifacts}`);
  console.log("-".repeat(60));
}

async function registerArtifact(contract, signer) {
  console.log("\n📝 Register New Artifact");
  console.log("-".repeat(60));

  const id = await question("Enter artifact ID (number): ");
  const value = await question("Enter artifact value (number): ");
  const age = await question("Enter artifact age in years (number): ");
  const category = await question("Enter artifact category (e.g., Painting, Sculpture): ");
  const isAuthentic = await question("Is artifact authentic? (yes/no): ");

  console.log("\n⏳ Registering artifact...");

  try {
    const tx = await contract.registerArtifact(
      parseInt(id),
      parseInt(value),
      parseInt(age),
      isAuthentic.toLowerCase() === "yes",
      category
    );

    console.log(`📝 Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Artifact registered successfully!`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function grantAccess(contract, signer) {
  console.log("\n🔓 Grant Access to Artifact");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");
  const viewerAddress = await question("Enter viewer address: ");
  const purpose = await question("Enter access purpose: ");

  console.log("\n⏳ Granting access...");

  try {
    const tx = await contract.grantAccess(
      parseInt(artifactIndex),
      viewerAddress,
      purpose
    );

    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Access granted successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function revokeAccess(contract, signer) {
  console.log("\n🔒 Revoke Access from Artifact");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");
  const viewerAddress = await question("Enter viewer address: ");

  console.log("\n⏳ Revoking access...");

  try {
    const tx = await contract.revokeAccess(
      parseInt(artifactIndex),
      viewerAddress
    );

    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Access revoked successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function transferOwnership(contract, signer) {
  console.log("\n🔄 Transfer Artifact Ownership");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");
  const newOwner = await question("Enter new owner address: ");

  console.log("\n⏳ Transferring ownership...");

  try {
    const tx = await contract.transferOwnership(
      parseInt(artifactIndex),
      newOwner
    );

    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Ownership transferred successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function certifyExpert(contract, signer) {
  console.log("\n👨‍🔬 Certify Expert");
  console.log("-".repeat(60));

  const expertAddress = await question("Enter expert address: ");
  const certified = await question("Certify (yes) or revoke (no)?: ");

  console.log("\n⏳ Processing...");

  try {
    const tx = await contract.certifyExpert(
      expertAddress,
      certified.toLowerCase() === "yes"
    );

    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Expert status updated successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function viewArtifactInfo(contract, signer) {
  console.log("\n🔍 View Artifact Information");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");

  try {
    const info = await contract.getArtifactInfo(parseInt(artifactIndex));

    console.log("\n📋 Artifact Details:");
    console.log(`  Active: ${info.isActive}`);
    console.log(`  Owner: ${info.owner}`);
    console.log(`  Timestamp: ${new Date(Number(info.timestamp) * 1000).toLocaleString()}`);
    console.log(`  Category: ${info.category}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function viewAccessHistory(contract, signer) {
  console.log("\n📜 View Access History");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");

  try {
    const history = await contract.getAccessHistory(parseInt(artifactIndex));

    console.log(`\n📊 Access Records (${history.accessors.length}):`);

    for (let i = 0; i < history.accessors.length; i++) {
      console.log(`\n  Record #${i + 1}:`);
      console.log(`    Accessor: ${history.accessors[i]}`);
      console.log(`    Time: ${new Date(Number(history.accessTimes[i]) * 1000).toLocaleString()}`);
      console.log(`    Purpose: ${history.purposes[i]}`);
      console.log(`    Approved: ${history.approvals[i]}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function deactivateArtifact(contract, signer) {
  console.log("\n🚫 Deactivate Artifact");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");

  console.log("\n⏳ Deactivating artifact...");

  try {
    const tx = await contract.deactivateArtifact(parseInt(artifactIndex));
    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Artifact deactivated successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

async function reactivateArtifact(contract, signer) {
  console.log("\n✅ Reactivate Artifact");
  console.log("-".repeat(60));

  const artifactIndex = await question("Enter artifact index: ");

  console.log("\n⏳ Reactivating artifact...");

  try {
    const tx = await contract.reactivateArtifact(parseInt(artifactIndex));
    console.log(`📝 Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log(`✅ Artifact reactivated successfully!`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Error handling
main()
  .then(() => {})
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    rl.close();
    process.exit(1);
  });
