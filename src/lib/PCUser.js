class PCUser {
    /*
    constructor(pcuserEntity) {
        { this.userId } = userId;
        { this.firstName } = firstName;
        { this.lastName } = lastName;
        { this.jobTitle } = jobTitle;
        { this.officeRoom } = officeRoom;
        { this.officeBuilding } = officeBuilding;
        { this.phoneNumber } = phoneNumber;
        { this.emailAddres } = emailAddres;
    }
    */
    constructor(/*pcUserId,*/ userId, firstName, lastName,
        jobTitle, officeRoom, officeBuilding, phoneNumber, emailAddres) {
        //this.pcUserId = pcUserId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.jobTitle = jobTitle;
        this.officeRoom = officeRoom;
        this.officeBuilding = officeBuilding;
        this.phoneNumber = phoneNumber;
        this.emailAddres = emailAddres;
    }

    /*
    get userId() {
        return this.userId;
    }

    get firstName() {
        return this.firstName;
    }

    get lastName() {
        return this.lastName;
    }

    get position() {
        return this.position;
    }

    get officeRoom() {
        return this.officeRoom;
    }

    get officeBuilding() {
        return this.officeBuilding;
    }

    get phoneNumber() {
        return this.phoneNumber;
    }

    get emailAddres() {
        return this.emailAddres;
    }
    */
}

module.exports = {
    PCUser
};
