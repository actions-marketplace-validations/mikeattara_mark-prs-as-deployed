const core = require('@actions/core');
const github = require('@actions/github');

try {
    const prList = core.getInput('PR_LIST', {required: true});
    const isProd = core.getInput('IS_PRODUCTION_DEPLOY', {required: true});
    console.log(prList, isProd);
    const token = core.getInput('GITHUB_TOKEN', {required: true});
    const IS_PRODUCTION_DEPLOY = JSON.parse(isProd);
    const PR_LIST = JSON.parse(prList);
    const DATE = new Date();
    // eslint-disable-next-line max-len
    const MESSAGE = `Deployed to ${IS_PRODUCTION_DEPLOY ? 'production' : 'staging'} on ${DATE.toDateString()} at ${DATE.toTimeString()}`;

    const octokit = github.getOctokit(token);

    PR_LIST.forEach(pr => {
        createComment(pr, MESSAGE, octokit);
    })
} catch(error) {
    console.log(`Error: ${error.message}`)
    core.setFailed(error.message)
}

/**
 * Create comment on pull request
 *
 * @param {Number} number - The pull request number
 * @param {String} messageBody - The comment message
 * @param {Object} number - The ocktokit client
 * @returns {Promise}
 */
async function createComment(number, messageBody, octokitClient) {
    console.log(`Writing comment on #${number}`);
    try {
        const response = await octokitClient.issues.createComment({
            ...github.context.repo,
            issue_number: number,
            body: messageBody,
        });
        return response;
    } catch (error) {
        console.log(`Unable to write comment on #${number}`);
        core.setFailed(error);
    }
}

module.exports = {createComment};
