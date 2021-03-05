const core = require("@actions/core");
const github = require("@actions/github");

/**
 * Create comment on pull request
 *
 * @param {Number} number - The pull request or issue number
 * @param {String} messageBody - The comment message
 * @param {Object} octokitClient - The ocktokit client
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

try {
  const prList = JSON.parse(core.getInput("PR_LIST", { required: true }));
  const isProd = JSON.parse(
    core.getInput("IS_PRODUCTION_DEPLOY", { required: true })
  );
  const token = core.getInput("GITHUB_TOKEN", { required: true });
  const date = new Date();
  // eslint-disable-next-line max-len
  const message = `Deployed to ${
    isProd ? "production" : "staging"
  } on ${date.toDateString()} at ${date.toTimeString()}`;

  const octokit = github.getOctokit(token);

  prList.forEach((pr) => {
    createComment(pr, message, octokit);
  });
} catch (error) {
  console.log(`Error: ${error.message}`);
  core.setFailed(error.message);
}
