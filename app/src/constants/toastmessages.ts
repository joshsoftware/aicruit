import { toast } from "sonner";
import { ValidationMessage } from "./messages";

export const technicalGlitchToast = () =>
  toast.error(ValidationMessage.TECHNICAL_ERROR);

export const networkErrorToast = () =>
  toast.error(ValidationMessage.NETWORK_ERROR);
