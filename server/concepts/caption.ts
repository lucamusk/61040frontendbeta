import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface CaptionDoc extends BaseDoc {
  media: ObjectId;
  text: String;
  author: ObjectId;
}

export default class CaptionConcept {
  public readonly captions = new DocCollection<CaptionDoc>("captions");

  async create(author: ObjectId, media: ObjectId, text: String) {
    await this.canCreate(media);
    const _id = await this.captions.createOne({ media, text, author });
    return { msg: "Caption created successfully!", caption: await this.captions.readOne({ _id }) };
  }

  async delete(_id: ObjectId) {
    await this.captions.deleteOne({ _id });
    return { msg: "Caption deleted successfully!" };
  }

  async getCaptions(query: Filter<CaptionDoc>) {
    const captions = await this.captions.readMany(query, {
      sort: { dateUpdated: -1 },
    });
    return captions;
  }

  async getByAuthor(author: ObjectId) {
    return await this.getCaptions({ location, author });
  }

  async getCaptionById(_id: ObjectId) {
    console.log("Getting by id");
    const caption = await this.captions.readOne({ _id: new ObjectId(_id) });
    if (caption === null) {
      throw new NotFoundError(`Caption not found!`);
    }
    return caption;
  }

  async update(_id: ObjectId, update: Partial<CaptionDoc>) {
    this.sanitizeUpdate(update);
    await this.captions.updateOne({ _id }, update);
    return { msg: "Caption successfully updated!" };
  }

  async isAuthor(user: ObjectId, _id: ObjectId) {
    const caption = await this.captions.readOne({ _id });
    if (!caption) {
      throw new NotFoundError(`Caption ${_id} does not exist!`);
    }
    if (caption.author.toString() !== user.toString()) {
      throw new CaptionAuthorNotMatchError(user, _id);
    }
  }

  private sanitizeUpdate(update: Partial<CaptionDoc>) {
    // Make sure the update cannot change the author.
    const allowedUpdates = ["content", "options"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError(`Cannot update '${key}' field!`);
      }
    }
  }

  async getCaptionsByMedia(media: ObjectId) {
    const captions = await this.captions.readMany({ media }, { sort: { dateUpdated: -1 } });
    return captions;
  }

  private async canCreate(media: ObjectId) {
    if (media === null) {
      throw new BadValuesError("Media must be non-null!");
    }
  }
}

export class CaptionAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of caption {1}!", author, _id);
  }
}
