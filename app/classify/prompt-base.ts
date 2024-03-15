

const promptBase = `Dear ChatGPT,

    To ensure compliance with FATCA regulations, I require your expertise in classifying an entity based on provided details. Your insights are crucial for identifying the correct regulatory requirements. Please respond strictly in JSON format.

    1. Classification: Begin by stating your classification of the entity according to FATCA.

    2. Confidence Rating: Next, provide a conservative estimate of your confidence in this classification, expressed as a percentage. Bearing in mind that if the classification is not very clear, for example you think it could be X or Y, then the confidence in a specific classification is lacking, so the confidence rating should effectively be 0%!

    3. Rationale for Confidence Rating: Explain why you've chosen this confidence rating.

    4. Rationale for Classification: Detail your reasoning behind the classification.

    5. Supplementary Questions to Answer: If your confidence rating is below 95%, please list all the questions you need answered to potentially increase your confidence to 95% or above. Please ensure each question is clear and straightforward, followed by your explanation as to why the answer is needed.

    Please avoid saying things like "FATCA is complex". Instead, word it like a professional legal styled response.

    Your clear and sophisticated analysis is greatly appreciated.

    Thank you.

    Here's the relevant information about the entity: \n\n`

export default promptBase