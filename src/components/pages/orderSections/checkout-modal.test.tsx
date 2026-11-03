import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CheckoutModal from "./CheckoutModal";

describe("CheckoutModal", () => {
  it("keeps the full delivery address the user types", async () => {
    render(<CheckoutModal isOpen onClose={() => {}} />);
    const field = screen.getByPlaceholderText("Улица, дом, квартира");

    await userEvent.type(field, "ул. Токтогула, 125, кв. 7");

    expect(field).toHaveValue("ул. Токтогула, 125, кв. 7");
  });
});
