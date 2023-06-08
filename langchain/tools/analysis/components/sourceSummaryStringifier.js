import chalk from 'chalk';

export const sourceSummaryStringifier=(metadata)=>{

return `${chalk.underline.bold('Summary:')}
${metadata.summary}

${chalk.underline.bold('Quote:')}
${metadata.quote}

${chalk.underline.bold('Problem:')}
${metadata.problem}

${chalk.underline.bold('Solution:')}
${metadata.solution}

${chalk.underline.bold('Actors:')}
${metadata.actors.join(', ')}`

}

// export const sourceSummaryStringifier=(metadata)=>{

// return `Summary:
// ${metadata.summary}

// Quote:
// ${metadata.quote}

// Problem:
// ${metadata.problem}

// Solution:
// ${metadata.solution}

// Actors:
// ${metadata.actors.join(', ')}`
// }