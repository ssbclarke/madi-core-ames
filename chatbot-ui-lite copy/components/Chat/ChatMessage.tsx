/* eslint-disable @next/next/no-img-element */
import { FC } from "react";
import { marked } from "marked";
// import { sample } from "./markdownsample"

const renderer = new marked.Renderer();

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true,
});

type Props = {
  message: {
    role: "assistant" | "user";
    content: string;
  };
};

export const ChatMessage: FC<Props> = ({ message }) => {
  // const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  // message.content = sample //'## summary:\n\nhello what is up';
//   message.content = `
//   This is sight\n\n### IMAGES:\n\n ![realistic](http://localhost:3030/images/img-QIPDcLhxhKYB9Dkv3HVN3PVa.png) ![artistic](http://localhost:3030/images/img-HM4dx97Jgtc9Baf2qC0OHTho.png) ![scifi](http://localhost:3030/images/img-SaYDocyfQo97ZwlApKwrDJM9.png)`
  

  const contentWithImages = marked(message.content)
  return message.role === "assistant" ? (
    <div className="chat chat-start">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="assistant avatar" src="https://api.dicebear.com/6.x/bottts-neutral/svg?scale=110&mouth=smile01&eyes=round&backgroundType=solid&backgroundColor=606ff6" />
        </div>
      </div>
      <div
        className={`chat-bubble bg-neutral-content text-base-100 max-w-[85%] 
        prose 
        prose-p:mt-1
        prose-p:mb-3
        prose-p:leading-5
        prose-headings:my-1
        prose-headings:mt-3
        text-neutral 
        prose-li:my-0
        prose-ol:my-0
        prose-ul:my-0
        prose-ol:leading-5
        prose-ul:leading-5
        prose-img:max-w-[30%]
        prose-img:my-1
        prose-img:inline-block
        `}
        style={{ overflowWrap: "anywhere" }}
        data-theme="light"
        dangerouslySetInnerHTML={{ __html: contentWithImages }}
      />
    </div>
  ) : (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="user avatar" src="avatar.png" />
        </div>
      </div>
      <div
        className={`chat-bubble chat-bubble-info max-w-[85%] prose`}
        style={{ overflowWrap: "anywhere" }}
        dangerouslySetInnerHTML={{ __html: contentWithImages }}
      />
    </div>
  );
};
