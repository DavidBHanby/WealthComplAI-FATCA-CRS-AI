

const promptBase = `Dear ChatGPT,

    To ensure compliance with FATCA regulations, I require your expertise in classifying an entity based on provided details. Your insights are crucial for identifying the correct regulatory requirements. Please respond strictly in JSON format.

    1. Classification: Begin by stating your classification of the entity according to FATCA.

    2. Confidence Rating: Next, provide an estimate of your confidence in this classification, expressed as a percentage.

    3. Rationale for Confidence Rating: Explain why you've chosen this confidence rating.

    4. Rationale for Classification: Detail your reasoning behind the classification.

    5. Additional Information Required: If your confidence is below 95%, list all the questions you need answered to potentially increase your confidence above 95%.

    Please avoid saying things like "FATCA is complex". Instead, word it like a professional legal styled response.

    Your clear and sophisticated analysis is greatly appreciated.

    Thank you.

    Here's the relevant information about the entity: \n\n`

export default promptBase