import numpy as np
import pandas as pd

def generate_synthetic(mean, cov, n_samples=1000):
    synthetic = np.random.multivariate_normal(mean, cov, n_samples)
    return pd.DataFrame(synthetic, columns=mean.index)