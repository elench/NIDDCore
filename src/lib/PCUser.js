class PCUser {
    constructor(userId, firstName, lastName,
        jobTitle, officeRoom, officeBuilding, phoneNumber, emailAddress) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jobTitle = jobTitle;
        this.officeRoom = officeRoom;
        this.officeBuilding = officeBuilding;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
    }
}

module.exports = {
    PCUser
};
