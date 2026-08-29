from setuptools import setup, find_packages

setup(
    name="synapse-sdk",
    version="1.0.0",
    description="Official Python SDK for Synapse API Gateway and App Integration Platform",
    author="Synapse Core Team",
    author_email="support@synapse.dev",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0",
        "pydantic>=2.0.0"
    ],
    python_requires=">=3.8",
)
