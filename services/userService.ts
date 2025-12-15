import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileCloudinary } from "./ImageService";

export const updateUser = async (
  uid: string,
  updatedData: UserDataType
): Promise<ResponseType> => {
  try {
    if (updatedData.image?.uri) {
      const imageUploadRes = await uploadFileCloudinary(
        updatedData.image,
        "users"
      );

      if (!imageUploadRes.success)
        return {
          success: false,
          msg: imageUploadRes.msg || "Image upload failed",
        };

      updatedData.image = imageUploadRes.data;
    }
    
    const userRef = doc(firestore, "users", uid);
    await updateDoc(userRef, updatedData);
    return { success: true, msg: "User updated successfully" };
  } catch (error: any) {
    console.log("error updating user: ", error);
    return { success: false, msg: error?.message };
  }
};
