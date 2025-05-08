class StudentRequestDto {
  constructor(data) {
    // if (
    //   !data.username ||
    //   typeof data.username !== "string" ||
    //   data.username.trim() === ""
    // ) {
    //   throw new Error("Username must not be a non-empty string");
    // }
    if (
      !data.email ||
      typeof data.email !== "string" ||
      data.email.trim() === ""
    ) {
      throw new Error("Email must not be a non-empty string");
    }
    if (
      !data.password ||
      typeof data.password !== "string" ||
      data.password.trim() === ""
    ) {
      throw new Error("Password must not be a non-empty string");
    }

    // this.username = data.username.trim();
    this.email = data.email.trim();
    this.password = data.password.trim();
  }
}

module.exports = StudentRequestDto;
