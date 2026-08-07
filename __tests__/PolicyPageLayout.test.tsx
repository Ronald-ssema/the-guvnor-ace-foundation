import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PolicyPageLayout from "@/components/policies/PolicyPageLayout";

describe("PolicyPageLayout", () => {
  it("renders the policy title and content", () => {
    render(
      <PolicyPageLayout
        eyebrow="Safeguarding"
        title="Safeguarding Policy"
        description="Our safeguarding commitment."
        lastReviewed="5 August 2026"
        navigation={[
          {
            label: "Purpose",
            href: "#purpose",
          },
        ]}
      >
        <section id="purpose">
          <h2>Purpose</h2>
          <p>Protecting children and vulnerable people.</p>
        </section>
      </PolicyPageLayout>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Safeguarding Policy",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Purpose",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Protecting children and vulnerable people."),
    ).toBeInTheDocument();
  });

  it("renders policy navigation", () => {
    render(
      <PolicyPageLayout
        eyebrow="Privacy"
        title="Privacy Policy"
        description="Privacy information."
        lastReviewed="5 August 2026"
        navigation={[
          {
            label: "Information we collect",
            href: "#information",
          },
        ]}
      >
        <section id="information">
          <h2>Information we collect</h2>
        </section>
      </PolicyPageLayout>,
    );

    expect(
      screen.getByRole("link", {
        name: "Information we collect",
      }),
    ).toHaveAttribute("href", "#information");
  });
});
