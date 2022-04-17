require "whois-parser"

class Api::DomainsController < Api::ApplicationController
  def check_multi
    whois = Whois::Client.new

    @list = domain_params[:list]

    @response = {}
    @list.each do |domain|
      next unless domain.present?

      begin
        record = whois.lookup(domain)
      rescue => e
        next
      end

      @parser = record.parser

      @response[domain] = {
        domain: domain,
        available: available,
        details: {
          created_on: created_on,
          expires_on: expires_on,
          registrar: registrar,
          registrant_contacts: registrant_contacts,
          admin_contacts: admin_contacts,
          technical_contacts: technical_contacts,
          nameservers: nameservers
        }
      }
    end

    render json: @response
  end

  def domain_params
    params.require(:domain).permit(list: [])
  end

  private

  def created_on
    begin
      @parser.created_on
    rescue
      ""
    end
  end

  def expires_on
    begin
      @parser.expires_on
    rescue
      ""
    end
  end

  def available
    begin
      @parser.available?
    rescue
      ""
    end
  end

  def registrar
    begin
      @parser.registrar
    rescue
      ""
    end
  end

  def registrar
    begin
      @parser.registrar
    rescue
      ""
    end
  end

  def registrant_contacts
    begin
      @parser.registrant_contacts
    rescue
      []
    end
  end

  def admin_contacts
    begin
      @parser.admin_contacts
    rescue
      []
    end
  end

  def technical_contacts
    begin
      @parser.technical_contacts
    rescue
      []
    end
  end

  def nameservers
    begin
      @parser.nameservers
    rescue
      []
    end
  end
end