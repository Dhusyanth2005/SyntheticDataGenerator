import numpy as np

def evaluate_quality(real_df, synthetic_df):
    metrics = {}

    metrics["mean_diff"] = float(
        np.abs(real_df.mean() - synthetic_df.mean()).mean()
    )

    metrics["variance_diff"] = float(
        np.abs(real_df.var() - synthetic_df.var()).mean()
    )

    real_corr = real_df.corr()
    syn_corr = synthetic_df.corr()

    metrics["correlation_diff"] = float(
        np.abs(real_corr - syn_corr).mean().mean()
    )

    return metrics