const todorovUserLink = 'mongodb+srv://todorovUser:Tourier2014@cluster0-fyce0.mongodb.net/shop?retryWrites=true&w=majority'
const taskappUserLink = 'mongodb+srv://taskapp:Tourier2014@cluster0-fyce0.mongodb.net/shop?retryWrites=true&w=majority'
const useTodorovUserLink = true;
const userLink = useTodorovUserLink ? todorovUserLink : taskappUserLink;

module.exports = {
    userLink, 
    useTodorovUserLink
};