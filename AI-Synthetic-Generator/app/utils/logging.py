import matplotlib.pyplot as plt

def plot_distribution(real, synthetic, column):
    plt.hist(real[column], alpha=0.5, label="Real")
    plt.hist(synthetic[column], alpha=0.5, label="Synthetic")
    plt.legend()
    plt.show()