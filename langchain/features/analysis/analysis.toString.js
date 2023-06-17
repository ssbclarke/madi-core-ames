import chalk from 'chalk';

export const analysisStringifier=(metadata)=>{

return `${chalk.underline.bold('Summary:')}
${metadata.summary}

${chalk.underline.bold('Quote:')}
${metadata.quote}

${chalk.underline.bold('Problem:')}
${metadata.problem}

${chalk.underline.bold('Solution:')}
${metadata.solution}

${chalk.underline.bold('Actors:')}
${metadata.actors.join(', ')}

${chalk.underline.bold('Need:')}
${metadata.need}

${chalk.underline.bold('Ility:')}
${metadata.ility}

${chalk.underline.bold('Category:')}
${metadata.category}

${metadata.subcategory ? chalk.underline.bold('SubCategory:'):""}
${metadata.subcategory ? metadata.subcategory:""}
`

}