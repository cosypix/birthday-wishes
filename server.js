require('dotenv').config();

const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


//-----------ROUTES-----------//
app.get('/admin', (req, res) => {
    res.render('admin', {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    });
});


app.get('/wish/:slug', async (req, res) => {
    const { slug } = req.params;

    const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return res.status(404).send("Wish not found! Maybe create one?");
    }

    res.render('index', {
        name: data.recipient_name,
        message: data.message_body,
        mainImage: data.main_image_url,
        cardImage: data.card_image_url,
        giftImage: data.gift_image_url,
        audioLoop: data.audio_loop_url,
        audioCelebration: data.audio_celebration_url
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));