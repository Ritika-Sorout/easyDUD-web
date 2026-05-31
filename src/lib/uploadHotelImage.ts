import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getBucket } from "./firebase";

/**
 * Uploads a single hotel image to Firebase Storage under `hotels/` and returns
 * its public download URL.
 */
export async function uploadHotelImage(file: File): Promise<string> {
  const storage = getBucket();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const imageRef = ref(storage, `hotels/${Date.now()}_${safeName}`);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}
