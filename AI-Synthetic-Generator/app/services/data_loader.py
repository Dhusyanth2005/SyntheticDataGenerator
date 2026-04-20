import pandas as pd

def load_data(file_path):
    if file_path.endswith(".csv"):
        df = pd.read_csv(file_path)
    else:
        df = pd.read_excel(file_path)

    df = df.select_dtypes(include=["number"])
    df = df.dropna()

    return df