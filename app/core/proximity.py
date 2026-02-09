# app/core/proximity.py

def classify(rank: int, total: int) -> str:
    """
    Classificação proporcional sem quebrar o frontend.
    Mantém apenas: correct, near, medium, far
    """

    if rank == 1:
        return "correct"

    ratio = rank / total

    if ratio <= 0.05:      # top 5%
        return "near"
    elif ratio <= 0.20:    # top 20%
        return "medium"
    else:
        return "far"
