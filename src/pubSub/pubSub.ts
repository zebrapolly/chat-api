import { PubSub } from "graphql-subscriptions";

const pubSub = new PubSub();

export const SubProvider = {
  provide: 'PUB_SUB',
  useValue: pubSub,
}