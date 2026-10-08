import { getDesign } from "@/data/catalog";
import type { Address, CardConfig } from "@/lib/types";
import { isOntarioPostal } from "@/lib/utils";

export type AddressErrors = Partial<Record<"name" | "line1" | "city" | "postal", "required" | "postal">>;

export function addressErrors(a: Partial<Address> | undefined): AddressErrors {
  const errors: AddressErrors = {};
  if (!a?.name?.trim()) errors.name = "required";
  if (!a?.line1?.trim()) errors.line1 = "required";
  if (!a?.city?.trim()) errors.city = "required";
  if (!a?.postal?.trim()) errors.postal = "required";
  else if (!isOntarioPostal(a.postal)) errors.postal = "postal";
  return errors;
}

export const isAddressValid = (a: Partial<Address> | undefined) => Object.keys(addressErrors(a)).length === 0;

export function stepValidity(draft: CardConfig): boolean[] {
  const design = getDesign(draft.design);
  const needsPhoto = !!design?.photo || draft.includePhoto;
  const personalize = !needsPhoto || !!draft.photo;
  let recipients = false;
  if (draft.delivery === "mail") {
    recipients = draft.recipients.length > 0 && draft.recipients.every(isAddressValid);
  } else if (draft.delivery === "ship") {
    recipients = draft.quantity >= 1 && isAddressValid(draft.shipTo);
  } else {
    recipients = draft.quantity >= 1 && !!draft.pickupLocation;
  }
  const all = personalize && recipients;
  return [true, personalize, true, recipients, all];
}
