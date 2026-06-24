const isOverdue = (deadline: string) => new Date(deadline) < new Date()

export default isOverdue
