var {
    defineSupportCode
} = require('cucumber');

import webdriver from "selenium-webdriver";
const By = webdriver.By;
const until = webdriver.until;

defineSupportCode(function({
    Given,
    When,
    Then
}) {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    Given('I have provided a web preference type called {stringInDoubleQuotes}', function(web_preference_type, callback) {
        this.web_preference_type = web_preference_type;
        callback();
    });

    Given('a web preference type exists called {stringInDoubleQuotes}', function(web_preference_type) {
        return this.db.one("insert into web_preference_type (description) values ($1) returning id", [web_preference_type])
            .then((data) => this.exisiting_web_preference_id = data.id);
    });

    When('I save the web preference type', function() {
        return this.webPreferenceTypePage.openPage()
            .then(() => this.webPreferenceTypePage.addButton)
            .then(addButton => addButton.click())
            .then(() => this.webPreferenceTypePage.webPreferenceTypeDescriptionText)
            .then(textBox => textBox.sendKeys(this.web_preference_type))
            .then(() => this.webPreferenceTypePage.saveButton)
            .then(button => button.click())
            .then(() => sleep(500));
    });

    When('I retrieve a list of web preferences', function() {
        return this.webPreferenceTypePage.openPage()
            .then(() => this.webPreferenceTypePage.webPreferenceTypeList);
    });

    When('I update the web preference to {stringInDoubleQuotes},', function(changedWebPreference) {
        return this.webPreferenceTypePage.openPage()
            .then(() => this.webPreferenceTypePage.editButton(this.exisiting_web_preference_id))
            .then(button => button.click())
            .then(() => this.webPreferenceTypePage.webPreferenceTypeDescriptionTextFor(this.exisiting_web_preference_id))
            .then((textBox) => textBox.clear()
                .then(emptyTextBox => textBox.sendKeys(changedWebPreference)))
            .then(() => this.webPreferenceTypePage.saveButton)
            .then(button => button.click())
            ;
    });

    When('I delete a web preference type', function() {
        return this.webPreferenceTypePage.openPage()
            .then(() => this.webPreferenceTypePage.deleteButton(this.exisiting_web_preference_id))
            .then(button => button.click())
    });

    Then('the web preference type is in the database', function() {
        return this.db.one("select id, description from web_preference_type where description = $1", [this.web_preference_type])
            .then((data) => {
                expect(data.description).to.be.equal(this.web_preference_type);
            });
    });

    Then('I get an error message', function() {
        return this.driver.wait(until.elementIsVisible(this.webPreferenceTypePage.alert))
            .then(() => this.webPreferenceTypePage.alertText)
            .then(text => expect(text).to.be.contain('GraphQL error: duplicate key value violates unique constraint'));
    });

    Then('the web preference list contains {stringInDoubleQuotes}', function(preferenceType) {
        let textList = [];
        this.webPreferenceTypePage.webPreferenceTypeListElements
            .then(elementList => elementList.map(element => element.getText()
                .then(text => textList.push(text.trim()))))
            .then(() => expect(textList).to.include(preferenceType));
    });

    Then('the web preference type called {stringInDoubleQuotes} does not exist', function(web_preference_type) {
        let textList = [];
        this.webPreferenceTypePage.webPreferenceTypeListElements
            .then(elementList => elementList.map(element => element.getText()
                .then(text => textList.push(text.trim()))))
            .then(() => expect(textList).to.not.include(web_preference_type));
    });

    Then('the web preference value in the database is {stringInDoubleQuotes}', function(web_preference_value) {
        return sleep(1000).then(() => this.db.one("select id, description from web_preference_type where description = $1", [web_preference_value]))
            .then((data) => {
                expect(data.description).to.be.equal(web_preference_value);
            });
    });
});
