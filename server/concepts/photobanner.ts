import assert from "assert";
import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotFoundError } from "./errors";

export interface PhotoBannerDoc extends BaseDoc {
  item: ObjectId;
  photoUrl: string;
}

export default class PhotoBannerConcept {
  public readonly photoBanners = new DocCollection<PhotoBannerDoc>("photobanners");

  async setPhoto(item: ObjectId, photoUrl: string) {
    assert(item, new BadValuesError("Please specify an item"));
    assert(photoUrl, new BadValuesError("Please specify a photo"));
    const _id = await this.photoBanners.createOne({ item: new ObjectId(item), photoUrl });
    return { msg: "Photobanner created successfully!", banner: await this.photoBanners.readOne({ _id }) };
  }

  async getItemPhotoBanner(itemId: ObjectId) {
    const photoBanner = await this.photoBanners.readOne({ item: new ObjectId(itemId) });
    if (photoBanner === null) {
      throw new NotFoundError(`Photo not found!`);
    }
    return photoBanner;
  }
}
