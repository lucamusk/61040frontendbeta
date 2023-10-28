import assert from "assert";
import { ObjectId } from "mongodb";
import { Caption, User } from "../app";
import DocCollection, { BaseDoc } from "../framework/doc";
import { CaptionDoc } from "./caption";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface GroupDoc extends BaseDoc {
  name: string;
  members: ObjectId[];
  captions: ObjectId[];
}

export default class GroupConcent {
  public readonly groups = new DocCollection<GroupDoc>("groups");

  async create(name: string) {
    await this.canCreate(name);
    const _id = await this.groups.createOne({ name, members: [], captions: [] });
    return { msg: "Group created successfully!", group: await this.groups.readOne({ _id }) };
  }

  async getAllGroups() {
    const groups = await this.groups.readMany({});
    return groups;
  }

  async getGroupById(_id: ObjectId) {
    console.log("Looking for group with id:", _id);
    const group = await this.groups.readOne({ _id: new ObjectId(_id) });
    console.log("Found group:", group);
    assert(group !== null, new NotFoundError(`Group id not found!`));
    return group;
  }

  async getGroupByUser(_id: ObjectId) {
    const groups = await this.groups.readMany({ members: new ObjectId(_id) });
    return groups;
  }

  async getGroupByName(name: string) {
    const group = await this.groups.readOne({ name });

    assert(group !== null, new NotFoundError(`Group name not found!`));
    return group;
  }

  async getMemberUsers(name: string) {
    const group = this.getGroupByName(name);
    const users = (await group).members.map((id) => User.getUserById(id));
    return users;
  }

  async userInGroup(userId: ObjectId, groupId: ObjectId) {
    const group = await this.getGroupById(groupId);
    const groupUsers = group.members;
    let inGroup = false;

    for (const member of groupUsers) {
      if (member.equals(userId)) {
        inGroup = true;
        break;
      }
    }

    return inGroup;
  }

  async registerMember(userId: ObjectId, groupId: ObjectId) {
    const group = await this.getGroupById(groupId);
    if (await this.userInGroup(userId, groupId)) {
      throw new NotAllowedError("User already registered in group");
    }
    await this.groups.updateOne({ _id: groupId }, { members: group.members.concat([userId]) });
    return { msg: `Successfully registered user for ${group.name}` };
  }

  async removeMember(user: ObjectId, groupId: ObjectId) {
    const group = await this.getGroupById(groupId);
    if (!(await this.userInGroup(user, groupId))) {
      throw new NotAllowedError("User not registered in group");
    }

    await this.groups.updateOne({ _id: groupId }, { members: group.members.filter((member) => !member.equals(user)) });
    return { msg: `Successfully removed user from ${group.name}` };
  }

  async deleteGroup(_id: ObjectId) {
    await this.groups.deleteOne({ _id });
    return { msg: "Group deleted!" };
  }

  async groupExists(_id: ObjectId) {
    const maybeGroup = await this.groups.readOne({ _id });
    if (maybeGroup === null) {
      throw new NotFoundError(`Group not found!`);
    }
  }

  private async canCreate(name: string) {
    if (!name) {
      throw new BadValuesError("Group name must be non-empty!");
    }
    await this.isGroupNameUnique(name);
  }

  private async isGroupNameUnique(name: string) {
    if (await this.groups.readOne({ name })) {
      throw new NotAllowedError(`Group with name ${name} already exists!`);
    }
  }

  async addCaption(captionId: ObjectId, groupId: ObjectId) {
    const group = await this.getGroupById(groupId);
    if (group.captions) {
      await this.groups.updateOne({ _id: groupId }, { captions: group.captions.concat([captionId]) });
    } else {
      await this.groups.updateOne({ _id: groupId }, { captions: [captionId] });
    }
    return { msg: `Successfully registered user for ${group.name}` };
  }

  async removeCaption(captionId: ObjectId, groupId: ObjectId) {
    const group = await this.getGroupById(groupId);
    if (group.captions) {
      await this.groups.updateOne({ _id: groupId }, { captions: group.captions.filter((caption) => !caption.equals(captionId)) });
    } else {
      throw new BadValuesError("Caption does not exist in group");
    }

    return { msg: `Successfully removed user from ${group.name}` };
  }

  async getCaptions(name: string) {
    const group = await this.getGroupByName(name);
    let captions: CaptionDoc[];
    if (group.captions) {
      captions = await Promise.all((await group).captions.map((id) => Caption.getCaptionById(id)));
    } else {
      captions = [];
    }
    return captions;
  }

  async orderGroupContent(group: ObjectId, captions: CaptionDoc[], captionRatings: number[], sortFunc: (a: [CaptionDoc, number], b: [CaptionDoc, number]) => number) {
    const captionRatingPairs = captions.map((caption, i) => [caption, captionRatings[i]]) as [CaptionDoc, number][];
    const sortedPairs = captionRatingPairs.sort(sortFunc);
    const sortedCaptions = sortedPairs.map((pair: [CaptionDoc, number]) => pair[0]._id);

    await this.groups.updateOne({ _id: group }, { captions: sortedCaptions });
    return { msg: `Successfully ordered group captions` };
  }
}
