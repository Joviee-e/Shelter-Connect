from marshmallow import Schema, fields, validate


# ---------------------------------------------------
# NGO REGISTRATION SCHEMA
# ---------------------------------------------------
class NGORegisterSchema(Schema):
    """
    Validation for NGO registration
    """

    ngo_name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=120),
        error_messages={"required": "NGO name is required"}
    )

    email = fields.Email(
        required=True,
        error_messages={"required": "Valid email is required"}
    )

    password = fields.Str(
        required=True,
        validate=validate.Length(min=6),
        error_messages={"required": "Password is required"}
    )

    phone = fields.Str(
        required=True,
        validate=validate.Regexp(r"^[0-9]{10}$"),
        error_messages={"required": "Valid phone number required"}
    )


# ---------------------------------------------------
# NGO LOGIN SCHEMA
# ---------------------------------------------------
class NGOLoginSchema(Schema):
    """
    Validation for NGO login
    """

    email = fields.Email(
        required=True,
        error_messages={"required": "Valid email required"}
    )

    password = fields.Str(
        required=True,
        error_messages={"required": "Password required"}
    )


# ---------------------------------------------------
# NGO PROFILE UPDATE SCHEMA
# ---------------------------------------------------
class NGOUpdateSchema(Schema):
    """
    Validation for updating NGO profile
    """

    ngo_name = fields.Str(validate=validate.Length(min=2, max=120))
    phone = fields.Str(validate=validate.Regexp(r"^[0-9]{10}$"))
