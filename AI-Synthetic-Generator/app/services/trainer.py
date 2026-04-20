def train_model(df):
    mean = df.mean()
    cov = df.cov()
    return mean, cov