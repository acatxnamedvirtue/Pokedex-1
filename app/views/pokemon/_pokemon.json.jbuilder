json.extract! pokemon, :id, :attack, :defense, :image_url, :moves,
:name, :poke_type

# json.toys pokemon.toys, partial: "toys/toy", as: :toy

display_toys ||= false

if display_toys
  json.toys pokemon.toys do |toy|
    json.partial!("toys/toy", toy: toy)
  end
end
