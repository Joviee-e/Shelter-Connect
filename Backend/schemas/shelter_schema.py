from marshmallow import Schema, fields, validate, ValidationError


# ---------------------------------------------------
# BASE SHELTER SCHEMA
# ---------------------------------------------------
class ShelterBaseSchema(Schema):
    """
    Common fields used in shelter creation & updates
    """

    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "Shelter name is required"}
    )

    address = fields.Str(
        required=True,
        validate=validate.Length(min=5, max=250),
        error_messages={"required": "Address is required"}
    )

    city = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=80),
        error_messages={"required": "City is required"}
    )

    state = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=80),
        error_messages={"required": "State is required"}
    )

    pincode = fields.Str(
        required=True,
        validate=validate.Regexp(r"^[0-9]{6}$"),
        error_messages={"required": "Pincode is required"}
    )

    total_beds = fields.Int(
        required=True,
        validate=validate.Range(min=0),
        error_messages={"required": "Total beds required"}
    )

    available_beds = fields.Int(
        required=True,
        validate=validate.Range(min=0),
        error_messages={"required": "Available beds required"}
    )


# ---------------------------------------------------
# CREATE SHELTER SCHEMA
# ---------------------------------------------------
class CreateShelterSchema(ShelterBaseSchema):
    """
    Validation for adding shelter
    """
    pass


# ---------------------------------------------------
# UPDATE SHELTER SCHEMA
# ---------------------------------------------------
class UpdateShelterSchema(Schema):
    """
    Validation for updating shelter details
    All fields optional
    """

    name = fields.Str(validate=validate.Length(min=2, max=120))
    address = fields.Str(validate=validate.Length(min=5, max=250))
    city = fields.Str(validate=validate.Length(min=2, max=80))
    state = fields.Str(validate=validate.Length(min=2, max=80))
    pincode = fields.Str(validate=validate.Regexp(r"^[0-9]{6}$"))
    total_beds = fields.Int(validate=validate.Range(min=0))
    available_beds = fields.Int(validate=validate.Range(min=0))


# ---------------------------------------------------
# BED UPDATE SCHEMA
# ---------------------------------------------------
class BedUpdateSchema(Schema):
    """
    Validation for updating available beds
    """

    available_beds = fields.Int(
        required=True,
        validate=validate.Range(min=0),
        error_messages={"required": "available_beds is required"}
    )


# ---------------------------------------------------
# EMERGENCY TOGGLE SCHEMA
# ---------------------------------------------------
class EmergencyToggleSchema(Schema):
    """
    Validation for emergency mode toggle
    """

    status = fields.Boolean(
        required=True,
        error_messages={"required": "status field is required"}
    )
