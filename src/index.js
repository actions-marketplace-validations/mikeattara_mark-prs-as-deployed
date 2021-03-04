const core = require('@actions/core');
const github = require('@actions/github');

const PR_LIST = JSON.parse(core.getInput('PR_LIST', {required: true}));
const IS_PRODUCTION_DEPLOY = JSON.parse(core.getInput('IS_PRODUCTION_DEPLOY', {required: true}));
const TOKEN = core.getInput('GITHUB_TOKEN')
const DATE = new Date();
// eslint-disable-next-line max-len
const MESSAGE = `Deployed to ${IS_PRODUCTION_DEPLOY ? 'production' : 'staging'} on ${DATE.toDateString()} at ${DATE.toTimeString()}`;

console.log('TOKEN', TOKEN)

const octokit = github.getOctokit(TOKEN);

/**
 * Create comment on pull request
 *
 * @param {Number} number - The pull request number
 * @returns {Promise}
 */
async function createComment(number) {
    console.log(`Writing comment on #${number}`);
    try {
        const response = await octokit.issues.createComment({
            ...github.context.repo,
            issue_number: number,
            body: MESSAGE,
        });
        return response;
    } catch (error) {
        console.log(`Unable to write comment on #${number}`);
        core.setFailed(error);
    }
}

/**
 * Action runner function
 *
 */
function run() {
    PR_LIST.forEach((pr) => {
        createComment(pr);
    });
}

run();

module.exports = {createComment};
