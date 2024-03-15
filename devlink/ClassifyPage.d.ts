import * as React from "react";
import * as Types from "./types";

declare function ClassifyPage(props: {
  as?: React.ElementType;
  confidenceRating?: React.ReactNode;
  classification?: React.ReactNode;
  rationaleForClassification?: React.ReactNode;
  rationaleForConfidenceRating?: React.ReactNode;
  dd?: React.ReactNode;
  userInputSection?: Types.Devlink.Slot;
  additionalInformationRequired?: Types.Devlink.Slot;
}): React.JSX.Element;
