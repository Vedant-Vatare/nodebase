import { Readable } from "node:stream";
import {
	v2 as cloudinary,
	type UploadApiErrorResponse,
	type UploadApiResponse,
} from "cloudinary";
import multer from "multer";

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 10 * 1024 * 1024 },
});

cloudinary.config({
	cloudinary_url: process.env.CLOUDINARY_URL,
});

const uploadToCloudinary = (
	file: Express.Multer.File,
	options = {},
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			options,
			(
				error: UploadApiErrorResponse | undefined,
				result: UploadApiResponse | undefined,
			) => {
				if (error) reject(error);
				else if (result) resolve(result);
				else reject(new Error("Upload failed without error"));
			},
		);

		Readable.from(file.buffer).pipe(uploadStream);
	});
};

export const uploadFile = async (
	file: Express.Multer.File | undefined,
	options = {
		folder: "uploads",
		resource_type: "auto" as const,
	},
) => {
	if (!file) {
		throw new Error("No file provided");
	}
	return (await uploadToCloudinary(file, options)).secure_url;
};

export const uploadFiles = async (
	files: Express.Multer.File[] | undefined,
	options = {
		folder: "uploads",
		resource_type: "auto" as const,
	},
) => {
	if (!files || files.length === 0) {
		throw new Error("No files provided");
	}

	const uploadPromises = files.map((file) => uploadToCloudinary(file, options));
	return (await Promise.all(uploadPromises)).map((res) => res.secure_url);
};

export const deleteImages = async (
	publicIds: string | string[],
): Promise<{ success: boolean; failedIds?: string[] }> => {
	if (
		!publicIds ||
		(Array.isArray(publicIds) && publicIds.length === 0) ||
		publicIds === ""
	) {
		throw new Error("No public IDs provided");
	}
	const ids = typeof publicIds === "string" ? [publicIds] : publicIds;
	let allDeleted = true;
	const failedIds: string[] = [];

	for (const publicId of ids) {
		try {
			const result = await cloudinary.uploader.destroy(publicId);
			if (result.result !== "ok") {
				allDeleted = false;
				failedIds.push(publicId);
				console.log(`Failed to delete image: ${publicId}`, result);
			}
		} catch (error) {
			allDeleted = false;
			failedIds.push(publicId);
			console.log(`Error deleting image: ${publicId}`, error);
		}
	}

	if (allDeleted) {
		return { success: true };
	}
	return { success: false, failedIds };
};
