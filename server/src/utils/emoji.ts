import { Emoji } from "@emoji-mart/data";
import data from "@emoji-mart/data";
import { init, SearchIndex } from "emoji-mart";
import { logger } from "../utils/logger";

init({ data });

export const getEmoji = async (name: string): Promise<Emoji | undefined> => {
    const title = name.toLowerCase();
    let emoji;
    const emojis = await SearchIndex.search(title);
    emoji = emojis?.length > 0 ? emojis[0] : undefined;

    if (!emoji) {
        const words = title.split(/\s+/).sort((a, b) => b.length - a.length);
        for (let i = 0; i < words.length; i++) {
            const emojis = await SearchIndex.search(words[i]);
            emoji = emojis?.length > 0 ? emojis[0] : undefined;
            if (emoji) {
                break;
            }
        }
    }

    if (!emoji) {
        // star emoji
        const emojis = await SearchIndex.search("star");
        emoji = emojis?.length > 0 ? emojis[0] : undefined;
    }

    return emoji;
};
