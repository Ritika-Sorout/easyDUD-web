import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "./firebase";

export interface HotelRecordInput {
  hotelName: string;
  imageUrl: string;
  location: string;
  plan: "basic";
  paymentId: string;
  orderId: string;
}

/**
 * Persists a hotel registration to the Firestore `hotels` collection and
 * returns the new document id.
 */
export async function saveHotelRecord(record: HotelRecordInput): Promise<string> {
  const db = getDb();
  const docRef = await addDoc(collection(db, "hotels"), {
    ...record,
    status: "pending_review",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
