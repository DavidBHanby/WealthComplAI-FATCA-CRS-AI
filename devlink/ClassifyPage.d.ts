import * as React from "react";
import * as Types from "./types";

declare function ClassifyPage(props: {
  as?: React.ElementType;
  confidenceRating?: React.ReactNode;
  classification?: React.ReactNode;
  rationaleForClassification?: React.ReactNode;
  rationaleForConfidenceRating?: React.ReactNode;
  additionalInformationRequired?: React.ReactNode;
}): React.JSX.Element;
