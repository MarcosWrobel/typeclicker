import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf-8"));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  console.log("=== LEADERBOARD ===");
  const lbSnap = await getDocs(collection(db, "leaderboard"));
  lbSnap.forEach(doc => console.log(doc.id, "=>", doc.data()));

  console.log("\n=== SAVES ===");
  const savesSnap = await getDocs(collection(db, "saves"));
  savesSnap.forEach(doc => console.log(doc.id, "=>", doc.data()));
  
  process.exit(0);
}
run().catch(console.error);
