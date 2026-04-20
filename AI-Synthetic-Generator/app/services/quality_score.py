def compute_quality_score(metrics):
    score = 100 - (
        metrics["mean_diff"] * 10 +
        metrics["variance_diff"] * 5 +
        metrics["correlation_diff"] * 20
    )

    return max(score, 0)