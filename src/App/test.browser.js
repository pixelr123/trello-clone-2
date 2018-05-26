import { snapshotTest } from "./utils/puppeteer";
import * as labels from "./labels";
import * as fixtures from "./fixtures";

// See
// https://stackoverflow.com/questions/49979069/puppeteer-element-click-not-working-and-not-throwing-an-error
// for a possible reason why using frame.click() won't work in some situations
const evalClick = selector => `document.querySelector("${selector}").click()`;

// Since jsdom doesn't do layout, it's not possible to know if an element is
// visible on page using conventional tests. That's why we're testing that
// modals/popovers are actually shown when their triggers are clicked.
snapshotTest(
  it,
  fixtures.Board.default,
  async (frame, snap) => {
    await frame.click(`[aria-labelledby="${labels.editCard.id}"]`);
    await snap();
    await frame.evaluate(evalClick("#editCardBackdrop"));
    await frame.click(`[aria-labelledby="${labels.quickEditCard.id}"]`);
    await snap();
    await frame.evaluate(evalClick("#quickEditCardBackdrop"));
    await frame.click(`[aria-labelledby="${labels.cardsListActionsMenu.id}"]`);
    await frame.hover("[role='menuitem']");
    await snap();
  },
  10000
);

snapshotTest(it, fixtures.CardsList.CardsList.default, async (frame, snap) => {
  await Promise.all([
    frame.focus("[role='heading']"),
    frame.hover(`[aria-labelledby="${labels.cardsListActionsMenu.id}"]`)
  ]);
  await snap("[data-testid='CardsList']");
});

snapshotTest(it, fixtures.CardsList.Card.default, async (frame, snap) => {
  await frame.hover(`[aria-labelledby="${labels.editCard.id}"]`);
  await frame.hover(`[aria-labelledby="${labels.quickEditCard.id}"]`);
  await snap(`[aria-labelledby="${labels.editCard.id}"]`);
});

snapshotTest(it, fixtures.EditCard.EditCard.default, async (frame, snap) => {
  await snap(`[aria-describedby="${labels.editCardDescription.id}"]`);
});
