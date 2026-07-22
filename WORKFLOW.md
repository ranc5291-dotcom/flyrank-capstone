# # AI Prompting Workflow Comparison

## Overview

This assignment compares two AI-assisted development workflows while implementing the same React Settings Form feature.

## Round 1 – Vague Prompt

For the first implementation, I used a short, high-level prompt asking the AI to build a React settings form. The generated output included a functional interface with basic validation and styling. However, the prompt did not specify accessibility, reusable architecture, validation requirements, or verification steps. As a result, I had to manually review the generated code, verify the validation logic, and ensure the component behaved correctly.

## Round 2 – Precise Prompt

For the second implementation, I provided detailed requirements, including React with TypeScript, controlled components, reusable design, semantic HTML, accessibility attributes, validation rules, and verification steps. The AI produced a cleaner solution with better structure, reusable validation utilities, improved accessibility, and clearer separation of concerns. The resulting code required significantly less manual review.

## Comparison

The vague prompt generated a working solution but required additional debugging and manual verification. The structured prompt produced more maintainable code with stronger validation, improved accessibility, and reusable components. Although writing the detailed prompt took more time initially, it reduced the overall development and review effort.

## AI Mistake I Caught

I reviewed the generated project structure and ran the build process to verify that the implementation compiled successfully. This validation step helped confirm that the generated code met the specified requirements before it was committed to the repository.

## Lessons Learned

This exercise demonstrated that prompt quality directly affects code quality. Providing explicit requirements, expected behavior, accessibility guidelines, and verification instructions leads to more reliable and maintainable AI-generated code. In future projects, I will continue using structured prompts and always validate AI-generated code before committing it.