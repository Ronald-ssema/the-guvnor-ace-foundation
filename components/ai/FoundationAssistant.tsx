"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ContactDetails = {
  email: string;
  phoneDisplay: string;
};

const STARTER_QUESTIONS = [
  "How can I donate?",
  "What programmes do you run?",
  "How can I volunteer?",
];

export default function FoundationAssistant({ contact }: { contact: ContactDetails }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello. I’m the Guvnor Ace Foundation AI assistant. I can help with donations, volunteering, programmes and contact information.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(text: string) {
    const question = text.trim();

    if (!question || isSending) {
      return;
    }

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/foundation-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "The assistant could not respond.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ||
            "Please contact the foundation directly for more information.",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "The assistant is temporarily unavailable.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `${message} You can contact us at ${contact.email} or ${contact.phoneDisplay}.`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyboard(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="foundation-ai">
      {isOpen && (
        <section className="foundation-ai-panel" aria-label="AI assistant">
          <header className="foundation-ai-header">
            <div className="foundation-ai-identity">
              <div className="foundation-ai-avatar">GA</div>

              <div>
                <strong>Foundation AI Assistant</strong>
                <span>
                  <i aria-hidden="true" />
                  Online
                </span>
              </div>
            </div>

            <button
              type="button"
              className="foundation-ai-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI assistant"
            >
              ×
            </button>
          </header>

          <div className="foundation-ai-body">
            <div className="foundation-ai-messages" aria-live="polite">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`foundation-ai-message foundation-ai-message-${message.role}`}
                >
                  {message.content}
                </div>
              ))}

              {isSending && (
                <div className="foundation-ai-message foundation-ai-message-assistant">
                  <span className="foundation-ai-typing">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="foundation-ai-suggestions">
                {STARTER_QUESTIONS.map((question) => (
                  <button
                    type="button"
                    key={question}
                    onClick={() => void sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="foundation-ai-form" onSubmit={handleSubmit}>
            <label htmlFor="foundation-ai-input" className="sr-only">
              Ask the foundation AI assistant
            </label>

            <textarea
              id="foundation-ai-input"
              rows={1}
              maxLength={1200}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyboard}
              placeholder="Ask about donating, volunteering or our work…"
            />

            <button
              type="submit"
              disabled={isSending || input.trim().length === 0}
              aria-label="Send message"
            >
              Send
            </button>
          </form>

          <p className="foundation-ai-disclaimer">
            This assistant uses AI and may make mistakes. Confirm important
            information directly with the foundation.
          </p>
        </section>
      )}

      <button
        type="button"
        className="foundation-ai-launcher"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label="Open foundation AI assistant"
      >
        <span className="foundation-ai-launcher-icon">✦</span>
        <span>{isOpen ? "Close assistant" : "Ask our AI"}</span>
      </button>
    </div>
  );
}
