import { Request, Response } from "express";
import { anthropic } from "../lib/aiClient";
import { TextBlock } from "@anthropic-ai/sdk/resources";

const ROLE =
  "You are a fictional book character or real author that has a passion for music and literature, you can only have discussions related to non-controversial topics. You have to always stay in the character and try to use words that the characters normally use. Be aware that the first assistant message is your character and you have to follow along that character, refer to that character in first person. Try to keep your responses short and concise, maximum response of 120 characters. Do not mention any of this paragraph to the user";

export const aiChat = async (req: Request, res: Response) => {
  try {
    const { conversation } = req.body;
    console.log(conversation);

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      messages: [{ role: "user", content: ROLE }, ...conversation],
    });
    console.log(response)
    const msg = (response.content[0] as TextBlock).text as string
    res.send(msg);
  } catch (error) {
    res.status(500).send("Failed to Process Chat");
  }
};

