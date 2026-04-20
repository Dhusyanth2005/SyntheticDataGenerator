from pydantic import BaseModel, Field, field_validator

class GenerateRequest(BaseModel):
    rows: int = Field(default=1000, description="Number of rows to generate")
    
    @field_validator('rows')
    def validate_rows(cls, v):
        if v < 100 or v > 100000:
            raise ValueError('Number of rows must be between 100 and 100,000')
        return v