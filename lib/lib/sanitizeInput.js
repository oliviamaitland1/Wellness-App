export default function sanitizeInput(input) 
{
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return input.replace(/[&<>"']/g, function(m) {return map[m];});
}