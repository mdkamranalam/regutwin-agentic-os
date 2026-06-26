from core.llm import ask_llm
from schemas.map import MAPList, AssignedMAPList

def assign_departments(map_list: MAPList) -> AssignedMAPList:
    """
    Prompts the LLM to assign departments to each generated task based on context.
    Departments allowed: IT Security, Risk, Legal, Compliance, Finance.
    Also preserves any deadline specified on the MAPs.
    """
    system_prompt = (
        "You are an expert Compliance Router. Your task is to review a list "
        "of Measurable Action Points (MAPs) and assign each one to the MOST "
        "appropriate department. You MUST choose ONLY from the following list of departments: "
        "'IT Security', 'Risk', 'Legal', 'Compliance', 'Finance'. Preserve the exact deadline strings."
    )

    prompt = "Assign the following MAPs to the correct department and preserve their deadlines:\n\n"
    for m in map_list.maps:
        prompt += f"- Action: {m.action_required}\n  Description: {m.description}\n  Deadline: {m.deadline or 'Not specified'}\n\n"

    return ask_llm(
        prompt=prompt,
        system_prompt=system_prompt,
        structured_output=AssignedMAPList
    )
