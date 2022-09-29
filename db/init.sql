CREATE TYPE payemnt_option AS ENUM (
  'Private',
  'Share',
  'Upfront'
);

CREATE TYPE tx_status AS ENUM (
  'Pending',
  'Canceled',
  'Confirmed'
);

CREATE TABLE IF NOT EXISTS collections (
    id SERIAL PRIMARY KEY,
    token_address varchar(42) NOT NULL,
    name varchar NOT NULL,
    slug varchar NOT NULL,
    web_url varchar,
    discord_url varchar,
    twitter_url varchar
);

CREATE TABLE IF NOT EXISTS lends (
    id BIGINT NOT NULL PRIMARY KEY,
    owner varchar(42) NOT NULL,
    token_id BIGINT NOT NULL,
    payment_option payemnt_option NOT NULL,
    payment BIGINT NOT NULL,
    payment_token_address varchar(42) NOT NULL,
    valid_until BIGINT NOT NULL,
    min_rent_duration INT NOT NULL,
    max_rent_duration INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tx_status tx_status NOT NULL,
    tx_hash varchar(66) NOT NULL,
    collection_id INT NOT NULL,
    FOREIGN KEY (collection_id) REFERENCES collections(id)
);

CREATE INDEX IF NOT EXISTS lend_owner ON lends(owner);

CREATE TABLE IF NOT EXISTS rents (
    id BIGINT NOT NULL PRIMARY KEY,
    renter varchar(42) NOT NULL,
    start_at BIGINT NOT NULL,
    end_at BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tx_status tx_status NOT NULL,
    tx_hash varchar(66) NOT NULL,
    lend_id INT NOT NULL,
    FOREIGN KEY (lend_id) REFERENCES lends(id)
);

CREATE INDEX IF NOT EXISTS rent_renter ON rents(renter);

CREATE FUNCTION update_updated_on_user_task()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_task_updated_on
BEFORE UPDATE
    ON
    lends
FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_user_task();

CREATE TRIGGER update_user_task_updated_on
BEFORE UPDATE
    ON
    rents
FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_user_task();
